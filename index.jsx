import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function DetailOrder({ catatan }) {
  const [detail, setDetail] = useState({ items: [] });
  const printRef = useRef();
  const navigate = useNavigate();

  const downloadPDF = async () => {
    const capture = document.querySelector(".print");
    const canvas = await html2canvas(capture);
    const imgData = canvas.toDataURL("image/png");
    const doc = new jsPDF("p", "mm", "a4");
    const componentWidth = doc.internal.pageSize.getWidth();
    const componentHeight = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
    doc.save("DetailOrder.pdf");
  };

  useEffect(() => {
    const storedPesanan = localStorage.getItem("transaksi");
    if (storedPesanan) {
      setDetail(JSON.parse(storedPesanan));
    }
  }, []);

  useEffect(() => {
    if (detail.items.length > 0) {
      downloadPDF()
        .then(() => {
          setTimeout(() => {
            navigate("/pesan");
          }, 10000);
        })
        .catch((err) => {
          console.error("Error generating PDF:", err);
        });
    }
  }, [detail, navigate]);

  const jumlah = (harga, qty, diskon) => {
    const totalharga = harga * qty;
    const Diskon = totalharga * (diskon / 100);
    const setelah_diskon = totalharga - Diskon;
    return setelah_diskon;
  };
  const rupiah = (number) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(number);
  };

  const listpesan = detail.items.map((item, index) => ({
    No: index + 1,
    nama: item.namaproduk,
    harga: item.harga,
    jumlah: item.jumlah,
    disc: item.diskon,
    total: jumlah(item.harga, item.jumlah, item.diskon),
  }));

  return (
    <div className="w-full">
      <button></button>
      <div className="text-xs min-w-full print mt-6 lg:w-full flex flex-col">
        <h1 className="uppercase text-center lg:text-center">
          Transaksi Pesanan
        </h1>
        <div className="flex flex-col w-full lg:w-full mx-2">
          <h3 className="bg-gray w-1/2">Transaksi</h3>
          <table className="table-row text-xs">
            <tbody>
              <tr>
                <td>OrderID</td>
                <td>:</td>
                <td>{detail.idpemesan}</td>
              </tr>
              <tr>
                <td>Nama Pemesan</td>
                <td>:</td>
                <td>{detail.namapemesan}</td>
              </tr>
              <tr>
                <td>Tanggal</td>
                <td>:</td>
                <td>{detail.tglorder}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>{detail.alamat}</td>
              </tr>
              <tr>
                <td>No. Telepon</td>
                <td>:</td>
                <td>{detail.notlpn}</td>
              </tr>
              <tr>
                <td>Status Pembayaran</td>
                <td>:</td>
                <td>{detail.statusbayar}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex w-full mx-2 lg:mx-2 mt-2">
          <table style={{ borderCollapse: "collapse", width: "98%" }}>
            <thead>
              <tr style={{ border: "1px solid black" }}>
                <th style={{ border: "1px solid black" }}>No</th>
                <th style={{ border: "1px solid black" }}>Nama Barang</th>
                <th style={{ border: "1px solid black" }}>Harga</th>
                <th style={{ border: "1px solid black" }}>Jumlah</th>
                <th style={{ border: "1px solid black" }}>Disc</th>
                <th style={{ border: "1px solid black" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {listpesan.map((e) => (
                <tr
                  style={{ border: "1px solid black" }}
                  className="text-center"
                  key={e.No}
                >
                  <td style={{ border: "1px solid black" }}>{e.No}</td>
                  <td style={{ border: "1px solid black" }}>{e.nama}</td>
                  <td style={{ border: "1px solid black" }}>
                    {rupiah(e.harga)}
                  </td>
                  <td style={{ border: "1px solid black" }}>{e.jumlah}</td>
                  <td style={{ border: "1px solid black" }}>{e.disc}%</td>
                  <td style={{ border: "1px solid black" }}>
                    {rupiah(e.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h4 className="mx-2 lg:mx-2">Total Belanja: {rupiah(detail.total)}</h4>
        <p className="mx-2 lg:mx-2">
          Catatan:
          <span className="font-bold">
            *Untuk konfirmasi pembayaran, silakan datang ke outlet MauliaBakery
            yang beralamat di RT 02 RW 02, Dusun Sanggrahan, Desa Sukorejo,
            Kecamatan Tugu, Kabupaten Trenggalek. Pastikan Anda membawa bukti
            pembayaran untuk mempermudah proses verifikasi. Terima kasih atas
            pesanan Anda.*
          </span>
        </p>
      </div>
    </div>
  );
}
