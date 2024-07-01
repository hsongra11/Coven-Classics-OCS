import React from 'react';

const EmbeddedContent = () => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    paddingTop: 'max(60%, 326px)',
    height: 0,
    width: '100%',
  };

  const iframeStyle: React.CSSProperties = {
    position: 'absolute',
    border: 'none',
    width: '100%',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };

  const issuuUrl = "https://e.issuu.com/embed.html?d=copy_of_coven_classics_2480_x_3500_px_&u=hsrps&backgroundColor=%23000000&backgroundColorOpacity=100&hideIssuuLogo=true&hideShareButton=true";

  return (
    <div style={containerStyle}>
      <iframe
        allow="clipboard-write"
        sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-scripts allow-same-origin allow-popups allow-modals allow-popups-to-escape-sandbox allow-forms"
        allowFullScreen={true}
        style={iframeStyle}
        src={issuuUrl}
      ></iframe>
    </div>
  );
};

export default EmbeddedContent;
