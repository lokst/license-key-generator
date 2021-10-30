# license-key-generator

Demo of a license key generator service built on CloudFlare Workers and KV

## Service Endpoints

The license generator service provides 2 endpoints, /generate and /verify.

**/generate**
----
  Generates a license key for the given user id.

* **URL**

  /generate

* **Method:**

  `POST`

* **Data Params**

   **Required:**

  `{ userId : "ExampleUser" }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ licenseKey : "AAAA-AAAA-AAAA-AAAA" }`
 
* **Error Response:**

  * **Code:** 400 <br />
    **Content:** `License key already exists`


**/verify**
----
  Verifies a license key for the given user id.

* **URL**

  /verify

* **Method:**

  `POST`

* **Data Params**

   **Required:**

  `{ userId : "ExampleUser", licenseKey : "AAAA-AAAA-AAAA-AAAA" }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ valid : true }`

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
