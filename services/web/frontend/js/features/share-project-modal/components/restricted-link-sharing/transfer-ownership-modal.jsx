import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Icon from '@/shared/components/icon'
import { transferProjectOwnership } from '../../utils/api'
import AccessibleModal from '@/shared/components/accessible-modal'
import { useProjectContext } from '@/shared/context/project-context'
import { useLocation } from '@/shared/hooks/use-location'

export default function TransferOwnershipModal({ member, cancel }) {
  const { t } = useTranslation()

  const [inflight, setInflight] = useState(false)
  const [error, setError] = useState(false)
  const location = useLocation()

  const { _id: projectId, name: projectName } = useProjectContext()

  function confirm() {
    setError(false)
    setInflight(true)

    transferProjectOwnership(projectId, member)
      .then(() => {
        location.reload()
      })
      .catch(() => {
        setError(true)
        setInflight(false)
      })
  }

  return (
    <AccessibleModal show onHide={cancel}>
      <Modal.Header closeButton>
        <Modal.Title>{t('change_project_owner')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <Trans
            i18nKey="project_ownership_transfer_confirmation_1"
            values={{ user: member.email, project: projectName }}
            components={[<strong key="strong-1" />, <strong key="strong-2" />]}
            shouldUnescape
            tOptions={{ interpolation: { escapeValue: true } }}
          />
        </p>
        <p>{t('project_ownership_transfer_confirmation_2')}</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="modal-footer-left">
          {inflight && <Icon type="refresh" spin />}
          {error && (
            <span className="text-danger">
              {t('generic_something_went_wrong')}
            </span>
          )}
        </div>
        <div className="modal-footer-right">
          <Button
            type="button"
            bsStyle={null}
            className="btn-secondary"
            onClick={cancel}
            disabled={inflight}
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            bsStyle="primary"
            onClick={confirm}
            disabled={inflight}
          >
            {t('change_owner')}
          </Button>
        </div>
      </Modal.Footer>
    </AccessibleModal>
  )
}
TransferOwnershipModal.propTypes = {
  member: PropTypes.object.isRequired,
  cancel: PropTypes.func.isRequired,
}
