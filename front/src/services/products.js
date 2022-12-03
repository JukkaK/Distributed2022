export async function getAllProducts() {
  const response = await fetch('https://func-distributed-dbapi-we-001.azurewebsites.net/api/db', {
    method: 'GET',
    headers: {'Content-Type': 'application/json --verbose'},
    });
    return await response.json();
}

/* for local testing
  const response = await fetch('/api/stock');
    return await response.json();
  }
*/
export async function editAmount(data) {
  const response = await fetch(`/api/order`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({task: data})
  })
  return await response.json();
}