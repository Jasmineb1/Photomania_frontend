import 'cropperjs/dist/cropper.css';

import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { PencilIcon } from 'lucide-react';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import Cropper from 'react-cropper';
import { toast } from 'sonner';

import { useModal } from '../context/ModalContext';
import { queryClient } from '../main';

interface EditProfilePictureProps {
  image: string | File | null;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  setImagePreview: Dispatch<SetStateAction<string>>;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

const EditProfilePicture = ({
  image,
  selectedFile,
  setSelectedFile,
  setImagePreview
}: EditProfilePictureProps) => {
  const ACCEPTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png'];
  const [formError, setFormError] = useState<string | null>(null);
  const token = Cookies.get('token');
  const { setModal } = useModal();
  const cropperRef = useRef<Cropper>(null); // Ref for Cropper instance

  let id: string | undefined;
  let decoded: DecodedToken | null = null;

  if (token) {
    decoded = jwtDecode(token);
  }

  if (decoded) {
    id = decoded.userId;
  }

  const { mutate } = useMutation({
    mutationKey: ['updateProfilePic'],
    mutationFn: (data: FormData) =>
      fetch(`http://localhost:5000/profile/edit/${id}`, {
        method: 'PATCH',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update profile picture');
        }
        return res.json();
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile Picture Updated');
      setModal(null);
      setSelectedFile(null);
      setImagePreview('');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile picture');
    }
  });

  // Ensure cropperRef is properly initialized and attached to Cropper instance
  useEffect(() => {
    if (cropperRef.current) {
      // Access Cropper instance and do necessary setup
      const cropper = cropperRef.current.cropper;
      if (cropper) {
        // Optionally configure cropper settings
        // Example: cropper.setAspectRatio(1);
      }
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type.toLowerCase())) {
        setFormError('Only JPEG and PNG images are allowed');
        setSelectedFile(null);
        setImagePreview('');
      } else {
        setFormError(null);
        setSelectedFile(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const saveCroppedImage = () => {
    if (cropperRef.current) {
      // Ensure Cropper instance and getCroppedCanvas() method are available
      const cropper = cropperRef.current.cropper;
      if (cropper) {
        cropper.getCroppedCanvas().toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], 'cropped_image.png', {
              type: 'image/png'
            });
            setSelectedFile(croppedFile);
            setModal(null); // Close the modal after saving cropped image
            mutate(new FormData().append('image', croppedFile)); // Upload cropped image
          }
        });
      }
    }
  };

  return (
    <form className="flex flex-col items-center gap-4">
      <div className="relative aspect-square w-10/12">
        <Cropper
          ref={cropperRef}
          style={{ width: '100%', height: '100%' }}
          aspectRatio={1}
          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
          guides={true}
          viewMode={1} // Circular cropping area
        />
        <label
          htmlFor="image"
          className="bg-blue hover:bg-dark-blue absolute right-4 top-4 cursor-pointer rounded-md p-2 text-center text-white transition-colors duration-200">
          <PencilIcon size={16} />
        </label>
      </div>
      <input
        type="file"
        id="image"
        className="hidden"
        accept=".jpg,.jpeg,.png"
        onChange={handleImageChange}
      />
      {formError && <span className="text-red-600">{formError}</span>}
      <button
        type="button"
        onClick={saveCroppedImage}
        className={`bg-blue hover:bg-dark-blue disabled:bg-light-gray w-10/12 rounded-md p-3 text-white transition-colors duration-200 ${
          !selectedFile ? 'cursor-not-allowed disabled:opacity-50' : ''
        }`}
        disabled={!selectedFile}>
        Save
      </button>
    </form>
  );
};

export default EditProfilePicture;
