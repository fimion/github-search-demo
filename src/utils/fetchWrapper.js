async function fetchWrapper (url, options){
  const response = await fetch(url, options);
  if(response.ok){
    return await response.json();
  }else{
    throw {
      status: response.status,
      statusText: response.statusText,
      body: await response.json(),
    }
  }
}

export default fetchWrapper;
