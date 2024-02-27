import React, { useEffect, useState } from 'react'
import TrustGraph from './subComponents/TrustGraph';
import { Box, Typography } from '@material-ui/core';
import myAxiosInstance from '../axios';

export default function TrustGraphPage() {

    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [averagedWeights, setAveragedWeights] = useState({});

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

            //response.data.reduce((aggregated, currentRelationship)
            
            setAveragedWeights(aggregatedTrustRelationships(response.data));
            
            /*
            const namesArray = [];

            for(const trustRelationship of response.data){
                namesArray.push({trustRelationship.trustor.id : `${trustor.firstName} ${trustor.lastName}`})
            }
            setNames(namesArray);*/
            

            
            /*
                Get Data into this form: 
                
                const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];
                const links = [
                
            
                { source: 'A', target: 'B', weight: 5},
                { source: 'A', target: 'C', weight: 3},
                { source: 'B', target: 'C', weight: 1},
                { source: 'C', target: 'D', weight: 4 },
                { source: 'D', target: 'A', weight: 2 }, // Create a cycle for demonstration
                ];
            */
            
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
                
                //setLinks(prev => [...prev, {source: thisRelationship.trustor.id, target: thisRelationship.trustee.id, weight: thisRelationship.averageWeight}])
            }
            let uniqueNames = Array.from(unformattedNames);
            let uniqueNodes = Array.from(unformattedUnique);
            for(let k = 0; k < uniqueNodes.length; k++){
                uniqueNodes[k] = { "id": uniqueNodes[k], "name": uniqueNames[k] };
            }

            
            //console.log("newNodes: ", newNodes);
            console.log("unique: ", unformattedUnique);
            console.log("formatted: ", uniqueNodes);
            setNodes(uniqueNodes);
            setLinks(formattedLinks);

            //setNodes(uniqueNodes);

        }
    }, [averagedWeights])

    /*    useEffect(()=>{
        for (const nodeKey in links){
            const thisLink = links[nodeKey];
            if (!nodes.includes(thisLink.source)){
                setNodes(prev => [...prev, {id: thisLink.source}])
            }
            if (!nodes.includes(thisLink.target)){
                setNodes(prev => [...prev, {id: thisLink.target}])
            }
        }
    }, [links]);*/


    useEffect(()=>{
        console.log("Links", links);
        console.log("Nodes", nodes);
    }, [links, nodes])

    const width = 1000;
    const height = 1500;
  
  return (
        <Box >
            
            <Typography variant = "h2" style = {{marginTop: '7%'}}>Trust Graph</Typography>
            <Box>
                <TrustGraph  nodes = {nodes} links = {links} width = {width} height = {height}/>
            </Box>
        
        </Box>

  );
}
