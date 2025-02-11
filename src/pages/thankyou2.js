import React, { useEffect } from 'react'

function Thankyou2() {
  useEffect(() => {
    document.title = 'GutHealthlab DNA Form';
  }, []);

  return (
    <div>
      <div className='Carouseldiv'>

        <div align="center">
          <h1>Thank you for registering </h1>
          <p>Thank you for completing the DNAMAP form! We appreciate your time and effort in providing the necessary details . </p>
        </div>




      </div>
    </div>
  )
}

export default Thankyou2
