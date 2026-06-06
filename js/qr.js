window.scanQR = function () {

  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },

    {
      fps: 10,
      qrbox: 250
    },

    (decodedText) => {

      alert("QR Detected: " + decodedText);

      if (decodedText === "ATTENDANCE-2026") {

        markAttendance();

      }

      scanner.stop();

    },

    (error) => {
      console.log(error);
    }
  );
};