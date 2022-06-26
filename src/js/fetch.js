import axios from 'axios';

export async function getImg(searchValue, page) {
  const params = new URLSearchParams({
    key: '25347585-fb6f06c74961a891785be3853',
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });

  try {
    const response = await axios({
      method: 'get',
      url: `https://pixabay.com/api/?${params}`,
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}