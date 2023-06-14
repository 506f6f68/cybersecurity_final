"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Moment from "moment";

const ClientAppCard = ({ client }) => {
  const [idCopied, setIdCopied] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  const handleIdCopy = () => {
    setIdCopied(true);
    navigator.clipboard.writeText(client.client_id);
    setTimeout(() => setIdCopied(false), 2000);
  };
  const handleSecretCopy = () => {
    setSecretCopied(true);
    navigator.clipboard.writeText(client.client_secret);
    setTimeout(() => setSecretCopied(false), 2000);
  };
  return (
    <div className="drop-shadow-sm w-full rounded-lg bg-white p-2">
      <h1 className="text-lg font-inter font-bold">
        {client.client_metadata.client_name}
      </h1>
      <p className="mt-1 font-light text-sm text-gray-600">
        {Moment(parseInt(client.client_id_issued_at) * 1000).format(
          "YYYY-MMM-D, hh:mm:ss"
        )}
      </p>
      <a
        className="text-orange-700 text-sm font-light hover:underline"
        href={client.client_metadata.client_uri}
      >
        {client.client_metadata.client_uri}
      </a>

      <div className="flex justify-around w-full mt-3 gap-1">
        <button
          onClick={handleIdCopy}
          className={`${
            idCopied && "text-green-600"
          } font-light w-full hover:bg-gray-100 rounded-lg`}
        >
          {idCopied ? "Copied!" : "ID"}
        </button>
        <button
          onClick={handleSecretCopy}
          className={`${
            secretCopied && "text-green-600"
          } font-light w-full hover:bg-gray-100 rounded-lg`}
        >
          {secretCopied ? "Copied!" : "Secret"}
        </button>
        <Link
          href={`/clients/${client.client_id}`}
          className="text-center font-light w-full hover:bg-gray-100 rounded-lg"
        >
          Edit
        </Link>
        {/* <button className="font-light w-full hover:bg-gray-100 rounded-lg text-red-600">
          Delete
        </button> */}
        {/* <span className="font-light">Client ID: {client.client_id}</span> */}
        {/* <div className="copy_btn" onClick={handleCopy}>
          <Image
            //   src={
            //     copied === post.prompt
            //       ? "/assets/icons/tick.svg"
            //       : "/assets/icons/copy.svg"
            //   }
            src={"/assets/icons/tick.svg"}
            alt="user_image"
            width={12}
            height={12}
          />
        </div> */}
      </div>
    </div>
  );
};

export default ClientAppCard;
