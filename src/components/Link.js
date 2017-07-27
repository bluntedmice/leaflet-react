import React, { Component } from 'react'

function Link (props) {
  return (
    <li>
      <a href='{prop.href}'>
        {props.children}
      </a>

    </li>
 		)
}

export default Link
