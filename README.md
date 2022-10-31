# license-key-generator

Demo of a license key generator service built on CloudFlare Workers and KV

## OpenAPI Schema

The license generator service provides 2 endpoints, /generate and /verify.

The OpenAPI schema for the service are in [`openapi.yaml`](openapi.yaml).

## Example Usage

*/generate*

```
URL=https://REPLACE-WITH-ACTUAL-URL.workers.dev
LICENSE_KEY=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"userId": "test1"}' $URL/generate | jq -r ".licenseKey")
```

*/verify*

```
URL=https://REPLACE-WITH-ACTUAL-URL.workers.dev
curl --silent -X POST -H "Content-Type: application/json" -d "{\"userId\": \"test1\", \"licenseKey\": \"$LICENSE_KEY\"}" $URL/verify
```
