function sendEmail(payload, cb) {
    // We modify the payload slightly to match what Web3Forms expects
    var formData = {
      access_key: "a32b2043-030c-4b78-a356-40258a27e8bb", // Safe to expose
      subject: "New ECHELON Enquiry: " + payload.name,
      from_name: payload.name,
      email: payload.email,
      phone: payload.phone,
      project_level: payload.project_type,
      message: payload.message
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.web3forms.com/submit', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.timeout = 15000;
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      cb(xhr.status >= 200 && xhr.status < 300);
    };
    xhr.onerror   = function () { cb(false); };
    xhr.ontimeout = function () { cb(false); };
    
    try { xhr.send(JSON.stringify(formData)); } catch (e) { cb(false); }
  }
