import React, { useEffect, useState } from 'react';

interface Guest {
    id: string;
    firstName: string;
    lastName: string;
}

export default function GuestList() {
    const [error, setError] = useState(null as any);
    const [isLoaded, setIsLoaded] = useState(false);
    const [guests, setGuests] = useState(new Array<Guest>());
  
    useEffect(() => {
      fetch("http://rest-app/guest")
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setGuests(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, [])
  
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {guests.map(guest => (
            <li key={guest.id}>
              {guest.firstName} {guest.lastName}
            </li>
          ))}
        </ul>
      );
    }
  }
}
