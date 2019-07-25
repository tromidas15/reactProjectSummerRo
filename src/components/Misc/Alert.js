import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import React from 'react';

 export function AlertMod  (n)  {
     const {title , message , method , id} = n;
        confirmAlert({
            title: title ,
            message: message,
            buttons: [
              {
                label: 'Yes',
                onClick: () => method(id)
              },
              {
                label: 'No',
              }
            ]
          });



}
