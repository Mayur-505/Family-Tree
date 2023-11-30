// import React, { useRef, useState } from 'react';
// import { Avatar } from '@mui/material';
// import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
// import { useSelectedNodeState } from '../contexts';
// import { FamilyRightClickMenu } from './FamilyRightClickMenu';
// import { EditFamilyModal } from './EditFamilyModal';
// import '../components/Buttons/buttons.css';

// export const FolderNode = ({ node, depth, ancestors = [], selectedNode, setSelectedNode }) => {
//   const depthRef = useRef(depth + 1);
//   const ancestorsRef = useRef([...ancestors, node.id]);
//   const [open, setOpen] = useState(true);
//   const [anchor, setAnchor] = useState();
//   const [editModal, setEditModal] = useState(false);

//   const isItInSearch = (family) => {
//     // Add your search logic if needed
//     return true;
//   };

//   return (
//     <>
//       <li id={node.id}>
//         <div
//           className="li-header"
//           style={{
//             paddingLeft: `${15 * depthRef.current}px`,
//             background: selectedNode?.id === node.id ? 'rgb(225 225 225 / 30%)' : null,
//             whiteSpace: 'nowrap',
//             textOverflow: 'ellipsis',
//           }}
//           onClick={() => {
//             node.children && setOpen((prevState) => !prevState);
//             setAnchor(null);
//             // Update selectedNode when clicking on a node
//             setSelectedNode({ ...node, ancestors: ancestorsRef.current });
//           }}
//           onContextMenu={(e) => {
//             e.preventDefault();
//             // Update selectedNode when right-clicking on a node
//             setSelectedNode({ ...node, ancestors: ancestorsRef.current });
//             setAnchor(e.currentTarget);
//           }}
//         >
//           {!isItInSearch(node) && (
//             <>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 {node.children ? (
//                   open ? (
//                     <FaChevronDown style={{ marginRight: '4px' }} fontSize={'14px'} />
//                   ) : (
//                     <FaChevronRight style={{ marginRight: '4px' }} fontSize={'14px'} />
//                   )
//                 ) : (
//                   <></>
//                 )}
//                 <Avatar
//                   style={{ marginLeft: node.children ? 0 : '15px', color: '#fafafa', background: '#bc1b51' }}
//                   src={node[`Family Photo`] ? node[`Family Photo`][0] : null}
//                 >
//                   {node['Name'].charAt(0).toUpperCase()}
//                 </Avatar>
//                 <p style={{ fontSize: '1.2rem', marginLeft: 10 }}>{node['Name']}</p>
//               </div>
//               <div>
//                 <button className="buttons" onClick={() => setEditModal(true)}>
//                   Edit
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//         {node.children && (
//           <ul style={{ height: open ? '100%' : 0, overflow: 'hidden' }}>
//             {Object.values(node.children).map((subNode) => (
//               <FolderNode
//                 node={subNode}
//                 key={subNode.id}
//                 depth={depthRef.current}
//                 ancestors={ancestorsRef.current}
//                 selectedNode={selectedNode} // Pass selectedNode to subnodes
//               />
//             ))}
//           </ul>
//         )}
//       </li>
//       {<FamilyRightClickMenu anchorEl={anchor} setAnchorEl={setAnchor} depth={depthRef.current} />}
//       {<EditFamilyModal editModal={editModal} setEditModal={setEditModal} selectedNode={node} />}
//     </>
//   );
// };

// export default FolderNode;


import React, { useRef, useState } from "react"
import { Avatar } from "@mui/material"
import { FaChevronRight, FaChevronDown, FaFolder } from 'react-icons/fa'
import { useSelectedNodeState, useFilteredIdState } from "../contexts"
import { FamilyRightClickMenu } from "./FamilyRightClickMenu.jsx"
import { EditFamilyModal } from "./EditFamilyModal"
import '../components/Buttons/buttons.css'


export const FolderNode = ({ node, depth, ancentors = [] }) => {

  const depthRef = useRef(depth + 1)

  const ancentorsRef = useRef([...ancentors, node.id])

  const [open, setOpen] = useState(true)

  const [selectedNode, setSelectedNode] = useSelectedNodeState();

  const [filteredId] = useFilteredIdState();

  // const [searchText,setSearchText]=useSearchTextState();


  const [anchor, setAnchor] = useState();

  const [editmodal, setEditClick] = useState(false)

  const isItInSearch = (family) => {

    if (typeof (filteredId) != "object") return true;
    return (filteredId == null || filteredId?.has(family.id));
  }


  return (
    <>
      <li id={node.id}>
        <div
          className='li-header'
          style={{
            paddingLeft: `${15 * depthRef.current}px`,
            background: selectedNode?.id === node.id ? 'rgb(225 225 225 / 30%)' : null,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
          onClick={(e) => {

            node.children && setOpen(prevState => !prevState)
            setAnchor(null);

            setSelectedNode({ ...node, ancentors: ancentorsRef.current })
          }}

          // Adding code to handle right click on family member
          onContextMenu={(e) => {
            e.preventDefault();
            setSelectedNode({ ...node, ancentors: ancentorsRef.current })
            setAnchor(e.currentTarget);
            // console.log(anchor);

          }
          }


        >

          {!isItInSearch(node) &&
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {node.children ? open ? <FaChevronDown style={{ marginRight: '4px' }} fontSize={'14px'} /> : <FaChevronRight style={{ marginRight: '4px' }} fontSize={'14px'} /> : <></>}
                <Avatar style={{ marginLeft: node.children ? 0 : '15px', color: '#fafafa', background: '#bc1b51' }} src={node[`Family Photo`] ? node[`Family Photo`][0] : null}>{node["Name"].charAt(0).toUpperCase()}</Avatar>
                <p style={{ fontSize: '1.2rem', marginLeft: 10 }}>{node["Name"]}</p>
              </div>

              <div> <button className="buttons" onClick={() => setEditClick(true)}>Edit</button>  </div>
            </>
          }


        </div>
        {node.children && (
          <ul
            style={{ height: open ? '100%' : 0, overflow: 'hidden' }}
          >
            {Object.values(node.children).map((subNode, i) => {
              return (
                <FolderNode node={subNode} key={subNode.id} depth={depthRef.current} ancentors={ancentorsRef.current} />
              )
            })}
          </ul>
        )}




      </li>
      {<FamilyRightClickMenu anchorEl={anchor} setAnchorEl={setAnchor} depth={depthRef.current} />}
      {<EditFamilyModal editmodal={editmodal} setEditClick={setEditClick} selectedNode={node} />}

    </>
  )
}

