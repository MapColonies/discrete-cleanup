{{/*
Create configmap name as used by the service name label.
*/}}
{{- define "configmap.fullname" -}}
{{- printf "%s-%s-%s" .Release.Name .Chart.Name "configmap" | indent 1 }}
{{- end }}

{{/*
Create deployment name as used by the service name label.
*/}}
{{- define "cronjob.fullname" -}}
{{- printf "%s-%s-%s" .Release.Name .Chart.Name "cron-job" | indent 1 }}
{{- end }}
