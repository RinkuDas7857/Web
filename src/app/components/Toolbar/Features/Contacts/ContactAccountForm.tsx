import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { FormField } from 'grommet/es6/components/FormField'
import { TextInput } from 'grommet/es6/components/TextInput'
import { TextArea } from 'grommet/es6/components/TextArea'
import { selectContactsList } from 'app/state/contacts/selectors'
import { isValidAddress } from 'app/lib/helpers'
import { Contact } from 'app/state/contacts/types'
import { DeleteContact } from './DeleteContact'

interface ContactAccountFormProps {
  contact?: Contact
  onDelete?: (address: string) => void
  onCancel: () => void
  onSave: (contact: Contact) => void
}

interface FormValue {
  address: string
  name: string
}

export const ContactAccountForm = ({ contact, onDelete, onCancel, onSave }: ContactAccountFormProps) => {
  const { t } = useTranslation()
  const [deleteLayerVisibility, setDeleteLayerVisibility] = useState(false)
  const [value, setValue] = useState({ name: contact?.name || '', address: contact?.address || '' })
  const contacts = useSelector(selectContactsList)

  return (
    <Form<FormValue>
      style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
      messages={{ required: t('toolbar.contacts.validation.required', 'Field is required') }}
      onChange={nextValue => setValue(nextValue)}
      onSubmit={({ value }) =>
        onSave({ address: value.address.replaceAll(' ', ''), name: value.name.trim() })
      }
      value={value}
    >
      <Box flex="grow">
        <FormField
          name="name"
          required
          validate={(name: string) =>
            name.trim().length > 16
              ? {
                  message: t('toolbar.contacts.validation.nameLengthError', 'No more than 16 characters'),
                  status: 'error',
                }
              : undefined
          }
        >
          <TextInput name="name" placeholder={t('toolbar.contacts.name', 'Name')} />
        </FormField>
        <FormField
          disabled={!!contact}
          name="address"
          required
          validate={(address: string) =>
            !isValidAddress(address.replaceAll(' ', ''))
              ? {
                  message: t(
                    'toolbar.contacts.validation.addressError',
                    'Please enter a valid wallet address',
                  ),
                  status: 'error',
                }
              : !contact && contacts.find(contact => contact.address === address.replaceAll(' ', ''))
              ? {
                  message: t('toolbar.contacts.validation.addressNotUniqueError', 'Address already exists'),
                  status: 'error',
                }
              : undefined
          }
        >
          <TextArea
            disabled={!!contact}
            rows={3}
            name="address"
            placeholder={t('toolbar.contacts.address', 'Address')}
          />
        </FormField>
        {contact && onDelete && (
          <Box align="end">
            <Button
              style={{ fontSize: '14px', fontWeight: 600 }}
              margin={{ vertical: 'medium' }}
              color="status-error"
              label={t('toolbar.contacts.delete.button', 'Delete contact')}
              onClick={() => setDeleteLayerVisibility(true)}
              plain
            ></Button>
            {deleteLayerVisibility && (
              <DeleteContact
                onDelete={() => onDelete(contact.address)}
                onCancel={() => setDeleteLayerVisibility(false)}
              />
            )}
          </Box>
        )}
      </Box>
      <Box direction="row" align="center" justify="between" pad={{ top: 'medium' }}>
        <Button label={t('toolbar.contacts.cancel', 'Cancel')} onClick={onCancel} />
        <Button type="submit" label={t('toolbar.contacts.save', 'Save')} primary />
      </Box>
    </Form>
  )
}
