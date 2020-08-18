import { useMutation as apolloMutation } from '@apollo/react-hooks'

export const useMutation = (mutation, alert) => {
  return apolloMutation(
    mutation,
    { onError: (error) => { alert.show(error.message.replace('GraphQL error:', 'Error:'), { type: 'error' }) } }
  )

}
