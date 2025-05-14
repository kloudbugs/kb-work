// QR Code SVG styles for Bitcoin invoices
export const qrCodeStyles = `
<svg width="100%" height="100%" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <style>
        .qr-bg { fill: white; }
        .qr-module { fill: black; }
    </style>
    <rect class="qr-bg" width="29" height="29" />
    {{data}}
</svg>
`;