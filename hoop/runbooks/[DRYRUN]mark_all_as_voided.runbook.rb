user_email = {{ .user_email
  | description "User email that will appear in the audit log"
  | required "user_email is required"
  | type "email"
  | squote
}}

note_msg = '[DRYRUN] ' + {{ .note_msg
  | type "text"
  | required "note_msg is required"
  | default "Customer requested refund to original payer"
  | squote
}}


puts user_email
puts note_msg
