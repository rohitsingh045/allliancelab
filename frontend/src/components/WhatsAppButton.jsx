import React from "react";

const WhatsAppButton = () => {
  const phoneNumber = "916200488170"; // Admin's WhatsApp number
  const message = "Thank you for connecting with Alliance Diagnostics!";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        right: "20px",
        bottom: "80px",
        zIndex: 1000,
        borderRadius: "80%",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        
        fontSize: "40px",
        textDecoration: "none",
      }}
      aria-label="Chat with us on WhatsApp"
    >
      {/* WhatsApp logo as PNG image from provided URL */}
      <img
        src="https://freepnglogo.com/images/all_img/1716574609whatsapp-logo-png.png"
        alt="WhatsApp Logo"
        style={{ width: 50, height: 50, borderRadius: 50 }}
      />
    </a>
  );
};

export default WhatsAppButton;
