import React from 'react'
import { PrintFamilyTreeBtn } from '../Buttons/PrintFamilyTreeBtn'
import { AddFamilyBtn } from '../Buttons/AddFamilyBtn'
import { ExportFamilyBtn } from '../Buttons/ExportFamilyBtn'
import { ImportFamilyBtn } from '../Buttons/ImportFamilyBtn';
import GoogleApi from '../Buttons/GoogleApi';
import GoogleDrivePick from '../Buttons/GoogleDrivePick';
import Googledriveapp from '../Buttons/Googledriveapp';




export const ButtonPanel = () => {

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: "auto auto",
        // gridTemplateRows: "30px 4em 40px",
        // flexDirection: 'column',
        // flexWrap:"wrap",
        width: '100%',
        // height:"90px",
        gap: '5px',
        justifyContent: 'space-between',
        padding: '5px'
      }}
    >
      <AddFamilyBtn />
      <PrintFamilyTreeBtn />
      <ImportFamilyBtn />
      <ExportFamilyBtn />
      {/* <GoogleApi /> */}
      {/* <GoogleDrivePick /> */}
      <Googledriveapp />

    </div>
  )
}