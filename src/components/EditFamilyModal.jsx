import { Modal } from '@mui/material'
import React from 'react'
import { FamilyDetailsForm } from './FamilyDetailsForm';
import '../components/Buttons/buttons.css'

export const EditFamilyModal = ({ editmodal, setEditClick }) => {

  const handleClose = () => setEditClick(false)

  return (
    <>

      <Modal
        open={editmodal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <FamilyDetailsForm handleClose={handleClose} from />
        </div>
      </Modal>

    </>
  )
}

// export default EditFamilyModal
