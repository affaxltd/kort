import { Clipboard } from "react-feather";
import { useState, useContext } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Tippy from "@tippyjs/react";
import { Link as LinkType } from "../../types/_link";
import DeleteContext from "../../context/DeleteContext";
import { requestLinkApi } from "../../lib/linkLib";
import AlertContext from "../../context/AlertContext";
import EditContext from "../../context/EditContext";

const Link = ({ link }: { link: LinkType }) => {
	const { deleteRef } = useContext(DeleteContext);
	const { alertRef } = useContext(AlertContext);
	const { editRef } = useContext(EditContext);
	const [copied, setCopyState] = useState(false);
	const [copyTimeout, setCopyTimeoutState] = useState<null | NodeJS.Timeout>(
		null
	);
	const url = `${window.location.protocol}//${window.location.host}/${link.slug}`;

	return (
		<tr>
			<td className="px-6 py-4 whitespace-no-wrap flex">
				<div className="text-sm leading-5 text-gray-900 mr-3">
					<a target="_blank" href={url}>
						<span className="text-gray-400">
							{window.location.host}/
						</span>
						{link.slug}
					</a>
				</div>
				<Tippy
					content={
						<span
							className={copied ? "text-green-400" : "text-white"}
						>
							{copied ? "Copied!" : "Copy to clipboard"}
						</span>
					}
					placement="top"
					arrow={true}
					animation="scale-subtle"
					inertia={true}
					duration={200}
					theme="kort"
					allowHTML={true}
					hideOnClick={false}
				>
					<div>
						<CopyToClipboard
							text={url}
							onCopy={() => {
								setCopyState(true);
								if (copyTimeout) clearTimeout(copyTimeout);

								setCopyTimeoutState(
									setTimeout(() => {
										setCopyTimeoutState(null);
										setCopyState(false);
									}, 2500)
								);
							}}
						>
							<span className="w-4 h-5 flex flex-col justify-center cursor-pointer">
								<Clipboard className="w-4 h-4 stroke-current text-gray-900" />
							</span>
						</CopyToClipboard>
					</div>
				</Tippy>
			</td>
			<td className="px-6 py-4 whitespace-no-wrap">
				<div className="text-sm leading-5 text-gray-900">
					<a target="_blank" href={url}>
						{link.target.length > 50
							? `${link.target.substr(0, 50)}...`
							: link.target}
					</a>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-no-wrap">
				<div className="text-sm leading-5 text-gray-900">
					{link.clicks}
				</div>
			</td>
			<td className="px-6 py-4 whitespace-no-wrap">
				<div className="text-sm leading-5 text-gray-900">
					{new Date(link.created).toLocaleString()}
				</div>
			</td>
			<td className="px-6 py-4 flex justify-end w-full">
				<a
					className="text-sm leading-5 text-gray-900 cursor-pointer"
					onClick={async () => {
						editRef?.current?.open(
							async (newSlug, target) => {
								const response = await requestLinkApi(
									{
										currentSlug: link.slug,
										newSlug: newSlug,
										target,
									},
									"update"
								);

								if (response.ok) {
									alertRef?.current?.open(
										"Link has been edited.",
										"success"
									);
								} else {
									if (response.error)
										alertRef?.current?.open(
											response.error,
											"error"
										);
								}
							},
							link.slug,
							link.target
						);
					}}
				>
					Edit
				</a>
				<a
					className="text-sm leading-5 text-red-500 ml-4 cursor-pointer"
					onClick={async () => {
						deleteRef?.current?.open(
							async () => {
								const response = await requestLinkApi(
									{
										currentSlug: link.slug,
									},
									"delete"
								);

								if (response.ok) {
									alertRef?.current?.open(
										"Link has been deleted.",
										"success"
									);
								} else {
									if (response.error)
										alertRef?.current?.open(
											response.error,
											"error"
										);
								}
							},
							link.slug,
							link.slug,
							"link"
						);
					}}
				>
					Delete
				</a>
			</td>
		</tr>
	);
};

export default Link;
