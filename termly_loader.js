(function () {
  const { disableTermly, disabledTermlyCountries } =
    window.__TERMLY_FL_LOADER_DATA;

  const ipCountryCookie = document.cookie
    .split(';')
    .find(item => item.trim().startsWith('ipcountry='));
  const country = ipCountryCookie ? ipCountryCookie.split('=')[1] : '';
  const termlyIsDisabled =
    disableTermly || (disabledTermlyCountries ?? []).includes(country);

  if (!termlyIsDisabled) {
    const scr = document.createElement('script');
    scr.async = false;
    scr.defer = false;
    scr.type = 'text/javascript';
    scr.onload = () => window.onTermlyOrAnalyticsLoaded();
    scr.src =
      'https://app.termly.io/resource-blocker/aea7be20-4f35-4b58-bb49-c12e6859766e?autoBlock=on';
    document.head.appendChild(scr);
  } else {
    document
      .querySelectorAll('script[data-start-on-disabled-consent="true"]')
      .forEach(plainScript => {
        const newScript = plainScript.cloneNode(true);
        newScript.type = 'text/javascript';
        plainScript.parentNode.replaceChild(newScript, plainScript);
      });
  }
})();
