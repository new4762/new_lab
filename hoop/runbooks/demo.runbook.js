node -e  "console.log({{ .user_email
  | description "User email that will appear in the audit log"
  | placeholder "@email.com"
  | required "user_email is required"
  | type "email"
  | squote
}})"

node -e  "console.log('[DRYRUN] ' + {{ .note_msg
  | type "text"
  | required "note_msg is required"
  | default "Customer requested refund to original payer"
  | squote
}})"

node -e  "console.log({{ .refund_uids
  | description "All refund uid to mark as void with separate by space"
  | placeholder "rfnd_1 rfnd_2 rfnd_3"
  | required "refund_uids is required"
  | type "text"
  | squote
}}.split(' '))"
