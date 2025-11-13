import React from 'react';
import Helmet from "react-helmet";

const MetaData = ({title}) => {
  return (
    <Helmet>
        {/* When we import this component in any page then the title will be the same that we passed here. */}
        <title>{title}</title>
    </Helmet>
  );
};

export default MetaData;
