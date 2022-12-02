export async function getAllProducts() {

  const response = await fetch('http://localhost:7071/api/db', {
    method: 'GET',
    headers: {'Content-Type': 'application/json --verbose'},
  });
  return await response.json();
}


export async function editAmount(data) {
  console.log(data)
  const response = await fetch(`/api/order`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({task: data})
  })
  return await response.json();
}