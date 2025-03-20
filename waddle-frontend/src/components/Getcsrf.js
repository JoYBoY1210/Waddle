export const getCSRFTokenFromCookie = () => {
    console.log('All cookies:', document.cookie); 
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return csrfToken || null;
  };