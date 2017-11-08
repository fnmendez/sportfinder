async function jsonRequest(path, options = {}) {
  const result = await fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
  const json = await result.json()
  if (result.status !== 200) {
    throw Object.assign(new Error(), json)
  }
  return json
}

export default {
  async getSports(clubId) {
    return jsonRequest(`/clubs/${clubId}`)
  },
  async putSport(clubId, sportData = {}) {
    return jsonRequest(`/clubs/${clubId}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sportData),
    })
  },
}
