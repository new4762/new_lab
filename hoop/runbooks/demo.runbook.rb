ruby -e "puts('{{ .output
         | type "text"
         | required "output is required"
         | default "hello world"
}}')"
