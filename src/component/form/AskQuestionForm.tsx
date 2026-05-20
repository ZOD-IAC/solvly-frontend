'use client';
import { X } from 'lucide-react';
import Button from '../Button/Button';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from '@/features/messageSlice';
import { BASE_URL } from '@/utils/Setting';
import CustomEditor from '../editor/CustomEditor';
import DebounceSelect from '../common/DebounceSelect';
import {
  addQuestionTag,
  createQuestion,
  getQuestionTags,
} from '../../api/question/index';
import { Tag } from '../../utils/contants/type';

// Ask Question Form Component
const AskQuestionForm: React.FC = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    tags: [] as string[],
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tags: tagInput.map((t: any) => t._id),
    }));
  }, [tagInput]);

  // ── createTag: must return Tag | null ────────────────────────────────────────
  const createTag = async (query: string): Promise<Tag | null> => {
    const res = await addQuestionTag(query);

    const tag = res?.data ?? res?.newtag ?? null;

    // Guard: if _id is missing the key-prop warning will reappear.
    if (!tag?._id) {
      console.warn('[createTag] returned tag is missing _id:', tag);
      return null;
    }

    return tag as Tag;
  };

  // ── fetchTags: must return Tag[] ──────────────────────────────────────────────
  const fetchTags = async (query: string): Promise<Tag[]> => {
    const res = await getQuestionTags(query);

    const list: unknown[] = res?.data ?? [];

    // Guard: filter out any items missing _id so they can never cause key issues.
    return (list as Tag[]).filter((t) => !!t._id);
  };

  const handleError = (message: string) => {
    if (!message) return;
    dispatch(
      showMessage({
        message: message,
        messageType: 'error',
      }),
    );
  };

  const handleCheck = () => {
    const { title, tags } = formData;

    if (!title || !content || tags.length <= 0) {
      handleError('All fields are required !');
      return false;
    }

    if (title.split(' ').length < 5) {
      handleError('Minimum 5 words are required for title !');
      return false;
    }

    if (content.split(' ').length < 20) {
      handleError('Minimum 20 words are required for content !');
      return false;
    }

    if (tags.length <= 0) {
      handleError('Alteast 1 tag is required to ask question !');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!handleCheck()) return;

    try {
      const data = await createQuestion({ ...formData, content });
      if (!data.ok) {
        handleError(data?.message);
        throw new Error(data.message);
      }
      dispatch(showMessage({ message: data.message, messageType: 'success' }));
      setFormData({
        title: '',
        tags: [],
      });
      setContent('');
      setTagInput([]);
      return;
    } catch (error) {
      // Narrow the type to ensure error is an Error instance
      const errMessage =
        error instanceof Error ? error.message : 'Something went wrong';
      console.warn(errMessage, ': some error occurred');
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6`}>
      <div className='px-2 py-4 border-b border-slate-200'>
        <h2 className='text-2xl font-bold text-slate-900'>Ask Question</h2>
      </div>
      <div className='space-y-4 text-black'>
        <div>
          <label className='block text-sm font-medium text-slate-900 mb-2'>
            Title
          </label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder='e.g., How to center a div in CSS?'
            className='placeholder:text-slate-400 w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
          <p className='text-xs text-slate-500 mt-1'>
            Be specific and imagine you&apos;re asking a question to another
            person
          </p>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-900 mb-2'>
            Description
          </label>
          <CustomEditor onChange={setContent} value={content} />
          <p className='text-xs text-slate-500 mt-1'>
            Provide context, what you&apos;ve tried, and what you expect
          </p>
        </div>
        <DebounceSelect
          value={tagInput}
          onChange={setTagInput}
          fetchTags={fetchTags}
          createTag={createTag}
          multiple={true}
          max={5}
        />

        <div className='flex gap-3 pt-4'>
          <Button variant='primary' fullWidth onClick={handleSubmit}>
            Post Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionForm;
