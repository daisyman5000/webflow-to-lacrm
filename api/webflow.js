export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body;
  const data = body.data || {};

  const name = data["Name"] || "";
  const email = data["Email"] || "";
  const message = data["Message 2"] || "";
  const date = data["Date"] || "";
  const ip = data["IP Address"] || "";

  const payload = {
    UserCode: process.env.LACRM_USER_CODE,
    APIToken: process.env.LACRM_API_TOKEN,
    Function: "CreateContact",
    Parameters: {
      FullName: name,
      Email: email,
      CustomFields: {
        Source: "Webflow Form",
        Message: message,
        SubmissionDate: date,
        IPAddress: ip
      }
    }
  };

  try {
    const resp = await fetch("https://api.lessannoyingcrm.com/v2/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const dataReturned = await resp.json();
    console.log("LACRM Response:", JSON.stringify(dataReturned)); // 👈 NEW LINE
    res.status(200).json({ success: true, lacrmResponse: dataReturned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
