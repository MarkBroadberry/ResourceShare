
export const RADIUS =20;

function drawArrowhead(context, x, y, angle, radius) {
    //triangle - step back arrow in the x and y by the x and y components of the radius ( R cos theta and R sin theta)
      const newX = x - radius * Math.cos(angle);
      const newY = y - radius * Math.sin(angle);
      context.save();
      context.beginPath();
      context.translate(newX, newY);
      context.rotate(angle);
      context.moveTo(0, 0);
      context.lineTo(-0.7 * radius, 0.35 * radius);
      context.lineTo(-0.7 * radius, -0.35 * radius);
      context.closePath();
      context.fillStyle = '#333';
      context.fill();
      context.restore();
   
}

export const drawTrustGraph = (
  context,
  width,
  height,
  nodes,
  links,
) => {
  context.clearRect(0, 0, width, height);
    // when there are two links for the same trustee/trustor pair
    const commonLinkGroups = {};
    links.forEach((link)=>{
        let combinationKey;
        if(link.source.id > link.target.id){
            combinationKey = `${link.source.id}_${link.target.id}`;
        }else{
            combinationKey = `${link.target.id}_${link.source.id}`;
        }
        if(!commonLinkGroups[combinationKey]){
            commonLinkGroups[combinationKey] = [];
        }
        commonLinkGroups[combinationKey].push(link);
        
    })

  // Iterate through groups of links in the same pair, so that we can alternate the curvature in links next to each other
    Object.values(commonLinkGroups).forEach((linkGroup, groupIndex) => {
        linkGroup.forEach((link,index) => {

            const type = index > 0 ? 'curve': 'line'
            //extract source and target from link and store them as same name
            const {source, target} = link;
            //trig to calc arrow line points. 
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            

            //same as tan^-1() to get angle of line
            const angle = Math.atan2(dy,dx);


           
            //arrowhead properties
            const arrowSize = 6;

            const directionOfCurve = index % 2 === 0 ? 1: -1;

            const x1 = (target.x - RADIUS) * Math.cos(angle - Math.PI / 6);
            const y1 = (target.y - RADIUS) * Math.sin(angle - Math.PI / 6);
            const x2 = (target.x - RADIUS) * Math.cos(angle + Math.PI / 6);
            const y2 = (target.y - RADIUS) * Math.sin(angle + Math.PI / 6);
            const midpointX = (source.x + target.x) / 2;
            const midpointY = (source.y + target.y) / 2;


            //defines curve behaviour x is set so it curves halfway between points
            const quadraticParamsX =  (source.x + target.x) / 2;
            //change the co-efficient to change steepness of curve
            const quadraticParamsY =  (source.y + target.y) / 2 + 100;

            //This calculates the direction that the arrowhead for curves should go by taking the gradient between the node and the control point (which defines the curve)
            //so you get an arrowhead that is approximately on the direction of the curve
            
            const arcRadius = Math.sqrt((target.y - source.y) ** 2 + (target.x - source.x) ** 2) / 2;
            const lineWidth = link.weight;
            context.lineWidth = lineWidth;

            if (link.weight < 1.75){
              context.strokeStyle = '#fc0000';
            }else if(link.weight < 3.5){
              context.strokeStyle = '#ffb730';

            }else{
              context.strokeStyle = '#06d411';
            }
            
            

            //draw links
            context.beginPath();
            context.moveTo(source.x, source.y);

            if (type === 'line'){
              context.lineTo(target.x, target.y);
              context.stroke();
              drawArrowhead(context, target.x, target.y, angle, RADIUS);
              
            }else{
              context.quadraticCurveTo(quadraticParamsX,quadraticParamsY, target.x, target.y);
              
              context.stroke();

              const curveDy = Math.abs(target.y - quadraticParamsY)
              const curveDx = Math.abs(target.x - quadraticParamsX)
              const curveAngle = Math.atan2(curveDy, curveDx) + Math.PI;
              
              drawArrowhead(context, target.x, target.y, curveAngle, RADIUS, link.width);
            }
            

        });
    });


  // draw nodes
  nodes.forEach((node) => {
      
    if (!node.x || !node.y) {
      return;
    }

    
    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fillStyle = '#72eaf7';
    context.fill();
    
    
    //label the nodes with the users names
    context.fillStyle = '#000';
    context.font = '10px Arial'; 
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    //subtract from y coord for label to be underneath node (-RADIS - Constant)
    const splitNames = node.name.split(' ');
    const firstName = splitNames[0];
    const lastName = splitNames.slice(1).join(' ');
    //joins back multiple last names
    const topY = node.y - 6;
    const bottomY = node.y + 6;

    context.fillText(firstName, node.x, topY); 
    context.fillText(lastName, node.x, bottomY); 


    
  });


  
};
