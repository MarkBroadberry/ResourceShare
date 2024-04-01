from ResourceShare.models import Rating, Resource, CustomUser, TrustRelationship
from statistics import stdev, mean
import logging
from django.db.models import Min, Max, Avg
from math import log

logger = logging.getLogger(__name__)

def CalculateTrustRating(userId):
	#get rating and download information from the databse
	#double underscores resource__author follows the relationship to resource author i.e. rating.resource.author
	receivedRatings = Rating.objects.filter(resource__author = userId).values_list('rating', flat=True)
	wholeGivenRatings = Rating.objects.filter(author = userId)
	givenRatings = wholeGivenRatings.values_list('rating', flat=True)
	downloadCount = CustomUser.objects.get(id = userId).download_count
	
	#calculate mean received ratings, interaction ratio and rating deviance
	meanReceivedRatings = mean(receivedRatings) if receivedRatings else 0
	ratingDeviance = CalculateRatingDeviance(userId)
	if downloadCount == 0:
		interactionRatio = 0
	else:
		initialInteractionRatio = givenRatings.count()/downloadCount
		#if less than one, apply quadratic quadratic to improve trust score
		if initialInteractionRatio <= 1:
			interactionRatio = initialInteractionRatio ** 2
		#if greater than one (false reviews), use a punishing straight line equation to give a lower score
		else:
			interactionRatio = (-5 * initialInteractionRatio) + 6
	
	#normalise interaction ratio to be between 0 and 5
	interactionRatio = interactionRatio * 5
	
	#calcualte trust rating as a weighted average of the three metrics above
	trustRating = (0.6 * meanReceivedRatings) + (0.3 * (5-ratingDeviance)) + (0.1 * interactionRatio)
	
	if trustRating < 0:
		trustRating = 0
	#round the trust value to two decimal places
	trustRating = round(trustRating, 2)

	return trustRating


def RecalculateTrustRating():
	#get all users
	users = CustomUser.objects.all()

	#calculate trust rating for all users
	for user in users:
		user.trust_rating = CalculateTrustRating(user.id)
		user.save()

def IncrementDownloadCount(userId):
	user = CustomUser.objects.get(id = userId)
	user.download_count += 1
	user.save()
	return user.download_count

def CalculateRatingDeviance(userId):
	#function to calculate the average difference between the users rating and the
	#mean rating from other users on a resource, and average this across all resources

	#get all resources that a user has rated
	ratedResources = Resource.objects.filter(rating__author = userId)
	numberOfRatings = 0
	totalDifFromMean = 0

	for resource in ratedResources:
		#find the mean 
		meanRating = Rating.objects.filter(resource = resource).aggregate(mean_rating=Avg('rating'))['mean_rating']
		userRating = Rating.objects.filter(resource = resource, author= userId).values_list('rating', flat = True).first()

		#calculate difference from mean and then average this difference across resources.
		if userRating is not None:
			difFromMean = userRating - meanRating
			totalDifFromMean += abs(difFromMean) #handles negative
			numberOfRatings += 1

	avgDeviance = totalDifFromMean / numberOfRatings if numberOfRatings > 0 else 5

	return avgDeviance




def CalculatePropagativeTrust(originalWeight, userId, trusteeId):
	#Retrieve and aggregate all of the authorized user's trust relationships
	myTrustRelationships = aggregateTrustRelationships(TrustRelationship.objects.filter(trustor = userId))
	#Array for all of a neighbours relationships
	trusteeRelationships = []
	#Array for relationships between neighbour and target user
	relevantPropagativeRelationships = []
	#array of objects with values: relevant neighbour, user-to-neighbour trust, neighbour-to-target user trust
	propagativeWeights = []

	#Iterate through authorized user's trust relationships to get all neighbours relationships.
	for trustRelationshipKey in myTrustRelationships:
		trustRelationship = myTrustRelationships[trustRelationshipKey]
		#Now Iterating through values instead of keys: Values are in aggregated trust relationship form.
		#From the people that I 'trust', get all of their their relationships.
		trusteeRelationships.append(
			aggregateTrustRelationships(TrustRelationship.objects.filter(trustor = trustRelationship['trustee'])))
		
	#From all of a neighbours relationships, filter to the relevant ones (related to the target user)
	for trustedUser in trusteeRelationships:
		for compositeKey in trustedUser:
			if trustedUser[compositeKey]['trustee'].id == trusteeId:
				relevantPropagativeRelationships.append(trustedUser[compositeKey])
	
	#encapsulate propagative relationships in an array of objects.
	for i in relevantPropagativeRelationships:
			#iterate through user's relationships to get weight of user-to-neighbour relationships.
		for compKey in myTrustRelationships:
			myRelationship = myTrustRelationships[compKey]
			if myRelationship['trustee'] == i['trustor']:
				propagativeWeights.append({'trustedPerson': myRelationship['trustee'],
							    		   'myTrust': myRelationship['averageWeight'],
								     	   'propagativeTrust': i['averageWeight']})
	propagativeTrust = 0
	#trust threshold is the value at which we 'trust' someone
	trustThreshold = 2.5
	#w0 is the weighting we give to the original weight from the trust interaction. 
	w0 = 0.7
	#w1 is the weighting we give to the propagative trust of the other nodes. 
	w1 = 0.3
	for thisWeight in propagativeWeights:
		if thisWeight['myTrust'] >= trustThreshold:
			propagativeTrust += (float(thisWeight['myTrust']) * float(thisWeight['propagativeTrust'])) / 5
			#division by 5 to normalise value to the range 0 to 5 after multiplication
		else:
			propagativeTrust += (-1 * float(thisWeight['myTrust']) * float(thisWeight['propagativeTrust'])) / 5

	propagativeTrust = propagativeTrust / len(propagativeWeights)
	totalTrust = w0 * float(originalWeight) + w1 * float(propagativeTrust)
	if totalTrust < 0:
		totalTrust = 0
	totalTrust = round(totalTrust, 2)

	return totalTrust


#returns aggregated dictionary with the composite key as key, and the value is an object with the fields:
#trustor, trustee, totalWeight, count, averageWeight.
def aggregateTrustRelationships(trustRelationships):
	aggregatedRelationships = {}
	for trustRelationship in trustRelationships:
		compositeKey = str(trustRelationship.trustor) +"_" + str(trustRelationship.trustee)
		if compositeKey not in aggregatedRelationships:
			aggregatedRelationships[compositeKey] =  {
					'trustor': trustRelationship.trustor,
					'trustee': trustRelationship.trustee,
					'totalWeight': trustRelationship.weight,
					'count': 1
				}
		else:
			aggregatedRelationships[compositeKey]['totalWeight'] = aggregatedRelationships[compositeKey]['totalWeight'] + trustRelationship.weight
			aggregatedRelationships[compositeKey]['count'] = aggregatedRelationships[compositeKey]['count'] + 1
	
	for key in aggregatedRelationships:
		aggregatedRelationships[key]['averageWeight'] = aggregatedRelationships[key]['totalWeight'] / aggregatedRelationships[key]['count']

	return aggregatedRelationships
		   


	



