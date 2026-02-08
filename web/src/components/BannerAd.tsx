import { useRef, useEffect } from 'react';

export function BannerAd() {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(`
          <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; background:transparent;">
            <script type="text/javascript">
              atOptions = {
                'key' : '22f60cbde184452b7131b5d5083e812f',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/22f60cbde184452b7131b5d5083e812f/invoke.js"></script>
          </body>
        `);
                doc.close();
            }
        }
    }, []);

    return (
        <div className="flex justify-center my-6">
            <div className="bg-slate-900/50 rounded-sm overflow-hidden" style={{ width: '300px', height: '250px' }}>
                <iframe
                    ref={iframeRef}
                    title="Advertisement"
                    width="300"
                    height="250"
                    className="border-0 overflow-hidden"
                    scrolling="no"
                />
            </div>
        </div>
    );
}
