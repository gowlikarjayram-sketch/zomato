const http = require('http');

const payload = JSON.stringify({
  email: "test_ck@test.com",
  password: "password123",
  name: "Test CK",
  role: "cloud_kitchen"
});

const req = http.request('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const token = json.token;
    if (!token) {
        // try login
        const loginReq = http.request('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
                const token2 = JSON.parse(data2).token;
                testDish(token2);
            });
        });
        loginReq.write(JSON.stringify({email: "test_ck@test.com", password: "password123"}));
        loginReq.end();
    } else {
        testDish(token);
    }
  });
});
req.write(payload);
req.end();

function testDish(token) {
    const dishPayload = JSON.stringify({
        name: "Test Dish",
        price: 100,
        category: "Main Course",
        image: "test",
        description: "test",
        inStock: true
    });
    const req2 = http.request('http://localhost:5000/api/cloudkitchen/menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Length': Buffer.byteLength(dishPayload)
        }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            console.log('Response:', data);
        });
    });
    req2.write(dishPayload);
    req2.end();
}
