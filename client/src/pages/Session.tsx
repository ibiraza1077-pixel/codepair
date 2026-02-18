import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { Users, Copy, CheckCircle, Play, Lightbulb, MessageSquare, BookOpen, Timer, ChevronDown, ChevronUp, LogOut } from 'lucide-react';

const SOCKET_URL = 'https://hearty-abundance-production.up.railway.app';
const API_URL = 'https://hearty-abundance-production.up.railway.app';
