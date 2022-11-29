export async function getAllProducts() {

  const response = await fetch('http://localhost:7071/api/db', {
    method: 'GET',
    headers: {'Content-Type': 'application/json --verbose'},
  });
  return await response.json();
}

export async function getProductById(data) {
  console.log(data.id)
  const response = await fetch('http://localhost:7071/api/db', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json --verbose'},
    body: JSON.stringify({"document":{"id": data.id}})
  });
  return await response.json();
}


export async function editAmount(data) {
  console.log(data.number)
  const response = await fetch('http://localhost:7071/api/db', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json --verbose'},
      body: JSON.stringify({"document":{"id": data.id, "order": data.number}})
  })
  return await response.json();
}

export async function addItem(data) {
  console.log(data.number)
  const response = await fetch('http://localhost:7071/api/db', {
      method: 'POST',
      headers: {'Content-Type': 'application/json --verbose'},
      body: JSON.stringify({"document":{"name": data.name, "saldo": data.number}})
  })
  return await response.json();
}

export async function deleteItem(data) {
  console.log(data.number)
  const response = await fetch('http://localhost:7071/api/db', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json --verbose'},
      body: JSON.stringify({"id": data.id})
  })
  return await response.json();
}
