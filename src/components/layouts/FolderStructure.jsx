import React from 'react';
import { FolderNode } from '../FolderNode';
import { useTreeState } from '../../contexts';

export const FolderStructure = ({ selectedNode,setSelectedNode }) => {
  const [treeState] = useTreeState();

  return (
    <div style={{ borderBottom: '2px solid black', width: '100%', flexGrow: 1, overflowY: 'auto' }}>
      {Object.keys(treeState).length > 0 && (
        <ul>
          {/* Pass the selectedNode to FolderNode */}
          <FolderNode node={treeState} key={treeState.id} depth={0} selectedNode={selectedNode} setSelectedNode={setSelectedNode}/>
        </ul>
      )}
    </div>
  );
};



// import React, {useRef} from 'react'
// import { useTreeState } from '../../contexts'
// import { FolderNode } from '../FolderNode'

// import { Modal } from '@mui/material'


// export const FolderStructure = () => {

//     const depth = useRef(0)

//     const [treeState] = useTreeState()

//     return (
//         <div 
//             style={{
//                     borderBottom: '2px solid black',
//                     width: '100%',
//                     flexGrow: 1,
//                     overflowY : 'auto',
                   
//                 }}
//         >
            
//             {Object.keys(treeState).length > 0 && (
//                 <ul>
//                     <FolderNode node = {treeState} key={treeState.id} depth={depth.current} />
//                 </ul>
//             )}

           
//         </div>
//     )
// }

