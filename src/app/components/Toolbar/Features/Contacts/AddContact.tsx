import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Tabs } from 'grommet/es6/components/Tabs'
import { Tab } from 'grommet/es6/components/Tab'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { contactsActions } from 'app/state/contacts'
import { Contact } from 'app/state/contacts/types'
import { ContactAccountForm } from './ContactAccountForm'
import { layerOverlayMinHeight } from '../layer'
import { LayerContainer } from '../LayerContainer'

interface AddContactProps {
  setLayerVisibility: (isVisible: boolean) => void
}

export const AddContact = ({ setLayerVisibility }: AddContactProps) => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const dispatch = useDispatch()
  const submitHandler = (contact: Contact) => dispatch(contactsActions.add(contact))

  return (
    <LayerContainer hideLayer={() => setLayerVisibility(false)}>
      <Tabs alignControls="start">
        <Tab title={t('toolbar.contacts.add', 'Add Contact')} style={{ textTransform: 'capitalize' }}>
          <Box
            flex="grow"
            justify="center"
            height={{ min: isMobile ? 'auto' : layerOverlayMinHeight }}
            pad={{ vertical: 'medium' }}
          >
            <ContactAccountForm
              onCancel={() => setLayerVisibility(false)}
              onSave={contract => {
                submitHandler(contract)
                setLayerVisibility(false)
              }}
            />
          </Box>
        </Tab>
      </Tabs>
    </LayerContainer>
  )
}
