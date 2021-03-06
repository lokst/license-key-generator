import { v4 as uuidv4 } from 'uuid';

// @ts-ignore
const setLicenseKey = (userId: string, licenseKey: string) => LICENSE_STORE.put(userId, licenseKey);
// @ts-ignore
const getLicenseKey = (userId: string) => LICENSE_STORE.get(userId);

export async function handleRequest(request: Request): Promise<Response> {
  // TODO: Implement basic auth
  const url = new URL(request.url)
  if (url.pathname == "/generate") {
    const inputJson:Object = await request.json();
    // @ts-ignore
    const userId = inputJson["userId"];

    const existingLicenseKey = await getLicenseKey(userId);
    if (existingLicenseKey) {
      return new Response("License key already exists", { status: 400 });
    }

    const licenseKey = uuidv4();
    await setLicenseKey(userId, licenseKey);
    const responseData = {
      licenseKey
    }
    return new Response(JSON.stringify(responseData, null, 2), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  } else if (url.pathname == "/verify") {
    const inputJson = await request.json();
    // @ts-ignore
    const userId = inputJson["userId"];
    // @ts-ignore
    const licenseKey = inputJson["licenseKey"];
    const savedLicenseKey = await getLicenseKey(userId);
    const valid = licenseKey && licenseKey === savedLicenseKey;
    const responseData = {
      "valid": valid,
    }
    return new Response(JSON.stringify(responseData, null, 2), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });

  }
  else {
    return new Response("Invalid request type", { status: 400 });
  }

}
