from ResourceShare.models import Rating, Resource, CustomUser
from statistics import stdev, mean
import logging
from django.db.models import Min, Max, Avg
from math import log

logger = logging.getLogger(__name__)

def CalculateTrustRating(userId):
    #resources = Resource.objects.filter(author = user)
    #logger.info('resources: ', resources)

    #double underscores resource__author follows the relationship to resource author - rating.resource.author
    receivedRatings = Rating.objects.filter(resource__author = userId).values_list('rating', flat=True)
    WholeGivenRatings = Rating.objects.filter(author = userId)
    givenRatings = WholeGivenRatings.values_list('rating', flat=True)
    downloadCount = CustomUser.objects.get(id = userId).download_count
   
    #for rating in WholeGivenRatings:
        #logger.info(rating.resource)
    meanReceivedRatings = mean(receivedRatings) if receivedRatings else 0
    if len(givenRatings) >= 2:
        #logger.info("calculating standard deviation given for: ", userId)
        deviationGiven =  stdev(givenRatings)
    else:
        #logger.info("deviation 1 for: ", userId)
        deviationGiven = 1

    if len(receivedRatings) >= 2:
        #logger.info("calculating standard deviation recfor: ", userId)
        deviationReceived =  stdev(receivedRatings)
    else:
        deviationReceived = 1


    interactionRatio = givenRatings.count() if downloadCount == 0 else givenRatings.count()/downloadCount
    
    #(0.2 * (5 -deviationGiven)) + (0.1 * (5 - deviationReceived)) are these relevant?
    ratingDeviance = CalculateRatingDeviance(userId)
    #logger.info("rating deviance %s", str(ratingDeviance))
    
    
    trustRating = (0.6 * meanReceivedRatings) + (0.3 * (5-ratingDeviance)) + (0.1 * log(interactionRatio + 1))

    if trustRating > 5:
        trustRating = 5

    trustRating = round(trustRating, 2)

    #Trust Rating is computed as a float between 0 and 5

    return trustRating


def RecalculateTrustRating():
    users = CustomUser.objects.all()
    #logger.info("users: ", users)
    for user in users:
        #logger.info("current user in for loop: %s %s ", str(user.first_name), str(user.last_name))
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
        #logger.info("Mean rating for: %s, is %s", str(resource.name), str(meanRating))

        userRating = Rating.objects.filter(resource = resource, author= userId).values_list('rating', flat = True).first()
        #logger.info("user id %s, rating is %s", str(userId), str(userRating))
        #calculate difference from mean and then avg difference from mean across resources.
        if userRating is not None:
            difFromMean = userRating - meanRating
            totalDifFromMean += abs(difFromMean) #handles negative
            numberOfRatings += 1
        
        #logger.info("total difference = %s", str(totalDifFromMean))


    avgDeviance = totalDifFromMean / numberOfRatings if numberOfRatings > 0 else 5
    #logger.info("USER: %s , avg deviance: %s", userId, avgDeviance)
    return avgDeviance



