export async function getAllProducts() {

  const response = await fetch('/api/todos');
  return await response.json();
}

export async function editAmount(data) {
  console.log(data)
  const response = await fetch(`/api/todo`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({task: data})
  })
  return await response.json();
}
