import React, { useEffect, useState } from 'react'
import TrustGraph from './subComponents/TrustGraph';
import { Box, Typography } from '@material-ui/core';
import myAxiosInstance from '../axios';
import { CircularProgress } from '@material-ui/core';

export default function TrustGraphPage() {

    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [averagedWeights, setAveragedWeights] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    function aggregatedTrustRelationships(data){
        const aggregatedData = {};
        for(const relationship of data) {

            const compositeKey = `${relationship.trustor.id}_${relationship.trustee.id}`;
            //if that key pair has already been iterated over
            if(!aggregatedData[compositeKey]){
                aggregatedData[compositeKey] = {
                    trustor: relationship.trustor,
                    trustee: relationship.trustee,
                    totalWeight: relationship.weight,
                    count: 1
                };
            }else{
                aggregatedData[compositeKey].totalWeight = aggregatedData[compositeKey].totalWeight + relationship.weight
                aggregatedData[compositeKey].count = aggregatedData[compositeKey].count + 1;
            }
        }

        for (const key in aggregatedData){
            let totaledRelationship = aggregatedData[key];

            totaledRelationship.averageWeight = totaledRelationship.totalWeight / totaledRelationship.count;
        }
        return aggregatedData;
    }
    useEffect(()=> {

        myAxiosInstance.get('getTrustRelationshipList/').then((response)=>{
            console.log("successfully fetched Trust Relationships: ", response.data);

            
            setAveragedWeights(aggregatedTrustRelationships(response.data));
            
            
        }).catch((error) => {
            console.log("error fetching Trust Relationships: ", error);
        })


    }, []);

    useEffect(()=>{
        if(averagedWeights){
            console.log("average weights", averagedWeights);
            const formattedLinks = [];
            
            const unformattedUnique = new Set();
            const unformattedNames = new Set();

            for(const thisKey in averagedWeights){
                const thisRelationship = averagedWeights[thisKey];
                unformattedUnique.add(thisRelationship.trustee.id);
                unformattedUnique.add(thisRelationship.trustor.id);
                unformattedNames.add(`${thisRelationship.trustee.first_name} ${thisRelationship.trustee.last_name}`);
                unformattedNames.add(`${thisRelationship.trustor.first_name} ${thisRelationship.trustor.last_name}`);

                
                formattedLinks.push({source: thisRelationship.trustor.id, target: thisRelationship.trustee.id, weight: thisRelationship.averageWeight})
                
                
            }
            let uniqueNames = Array.from(unformattedNames);
            let uniqueNodes = Array.from(unformattedUnique);
            for(let k = 0; k < uniqueNodes.length; k++){
                uniqueNodes[k] = { "id": uniqueNodes[k], "name": uniqueNames[k] };
            }

            
            
            console.log("unique: ", unformattedUnique);
            console.log("formatted: ", uniqueNodes);
            setNodes(uniqueNodes);
            setLinks(formattedLinks);

         

        }
    }, [averagedWeights])


    useEffect(()=>{
        console.log("Links", links);
        console.log("Nodes", nodes);
        if(nodes.length > 0){
            setIsLoading(false);
        }
    }, [links, nodes])

    const width = 1000;
    const height = 1000;
  
  return (
        <Box >
            
            <Typography variant = "h2" style = {{marginTop: '7%'}}>Trust Graph</Typography>
            {isLoading && (
            <Box style = {{width: '25%' , paddingLeft:'48%'}}>
                <CircularProgress size={100}/>
            </Box>
            )}
            <Box>
                <TrustGraph  nodes = {nodes} links = {links} width = {width} height = {height}/>
            </Box>
        
        </Box>

  );
}
