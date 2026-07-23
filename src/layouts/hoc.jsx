import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const withTranslation = (WrappedComponent, translationKeys) => {
  return (props) => {
    const { t } = useTranslation();
    const [translatedData, setTranslatedData] = useState(null);

    useEffect(() => {
      const data = props.data || [];
      const translated = data.map(item => {
        let translatedItem = {};
        translationKeys.forEach(key => {
          translatedItem[key] = t(item[key]);
        });
        return translatedItem;
      });
      setTranslatedData(translated);
    }, [props.data, translationKeys, t]);  

    return <WrappedComponent {...props} data={translatedData} />;
  };
};

export default withTranslation;
