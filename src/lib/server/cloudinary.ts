import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET
});

type CloudinaryResourceType = 'image' | 'raw';

export type CloudinaryUpload = {
	secureUrl: string;
	publicId: string;
};

const uploadToCloudinary = async (
	file: File,
	resourceType: CloudinaryResourceType,
	folder: string
): Promise<CloudinaryUpload> => {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{ folder, resource_type: resourceType },
			(error, result) => {
				if (error) {
					console.error('Cloudinary upload failed:', error);
					reject(error);
				} else if (result) {
					resolve({ secureUrl: result.secure_url, publicId: result.public_id });
				} else {
					reject(new Error('Unknown Cloudinary upload error'));
				}
			}
		);

		uploadStream.end(buffer);
	});
};

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
	const upload = await uploadToCloudinary(file, 'image', 'tecnoesis26_modules');
	return upload.secureUrl;
};

export const uploadSponsorImageToCloudinary = async (file: File): Promise<string> => {
	const upload = await uploadToCloudinary(file, 'image', 'tecnoesis26_sponsors');
	return upload.secureUrl;
};

export const uploadPdfToCloudinary = (file: File) =>
	uploadToCloudinary(file, 'raw', 'tecnoesis26_documents');

export const deleteFromCloudinary = async (
	publicId: string,
	resourceType: CloudinaryResourceType
) => {
	const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
	if (result.result !== 'ok' && result.result !== 'not found') {
		throw new Error(`Cloudinary deletion failed: ${result.result}`);
	}
};

export const deleteImageFromCloudinaryUrl = async (url: string) => {
	const marker = '/upload/';
	const uploadIndex = url.indexOf(marker);
	if (uploadIndex === -1) return;

	let publicId = url.slice(uploadIndex + marker.length);
	publicId = publicId.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
	await deleteFromCloudinary(publicId, 'image');
};
