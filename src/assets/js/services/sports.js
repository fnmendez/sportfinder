async function jsonRequest(path, options = {}) {
  const result = await fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
  console.log(result)
  const json = await result.json()
  if (result.status !== 200) {
    throw Object.assign(new Error(), json)
  }
  return json
}

export default {
  async getSports() {
    return jsonRequest('/sports')
  },
}
