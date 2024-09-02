import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
	Scheduler,
	WeekView,
	MonthView,
	DayView,
	Appointments,
	AppointmentForm,
	AppointmentTooltip,
	Toolbar,
	ViewSwitcher,
	DateNavigator,
	TodayButton,
	EditRecurrenceMenu,
	ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';

import {
	ViewState,
	EditingState,
	IntegratedEditing,
} from '@devexpress/dx-react-scheduler';

import {
	collection,
	addDoc,
	getDocs,
	deleteDoc,
	doc,
} from 'firebase/firestore';

import { db } from './firebase'; // Import Firebase z konfiguracji w innym pliku

// Inicjalizacja Firebase i Firestore

export default function App() {
	const [data, setData] = useState([]);
	const [currentDate, setCurrentDate] = useState(
		new Date().toISOString().slice(0, 10)
	);
	const [currentViewName, setCurrentViewName] = useState('Month');

	// Funkcja do zapisywania wydarzeń do Firestor e
	const saveEventToFirestore = async (event) => {
		try {
			const docRef = await addDoc(collection(db, 'events'), event);
			return { id: docRef.id, ...event };
		} catch (error) {
			console.error('Błąd podczas zapisywania wydarzenia:', error);
		}
	};

	// Funkcja do pobierania wydarzeń z Firestore
	const fetchEventsFromFirestore = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, 'events'));
			const events = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();

				// Konwersja Timestamp na Date
				const startDate = data.startDate.toDate();
				const endDate = data.endDate.toDate();

				events.push({ id: doc.id, ...data, startDate, endDate });
			});
			return events;
		} catch (error) {
			console.error('Błąd podczas pobierania wydarzeń:', error);
		}
	};

	// Pobierz wydarzenia z Firestore przy ładowaniu aplikacji
	useEffect(() => {
		const fetchAndSetEvents = async () => {
			const eventsFromFirestore = await fetchEventsFromFirestore();
			setData(eventsFromFirestore);
		};

		fetchAndSetEvents();
	}, []);

	const commitChanges = async ({ added, changed, deleted }) => {
		if (added) {
			const newEvent = await saveEventToFirestore(added);
			setData((prevData) => [...prevData, newEvent]);
		}

		// Logi dla innych przypadków:
		if (changed) {
			const updatedData = data.map((appointment) =>
				changed[appointment.id]
					? { ...appointment, ...changed[appointment.id] }
					: appointment
			);
			setData(updatedData);
		}

		if (deleted !== undefined) {
			const updatedData = data.filter(
				(appointment) => appointment.id !== deleted
			);
			setData(updatedData);

			try {
				await deleteDoc(doc(db, 'events', deleted));
			} catch (error) {
				console.error('Błąd podczas usuwania wydarzenia:', error);
			}
		}
	};

	return (
		<Paper>
			<Scheduler data={data} height={660}>
				<ViewState
					currentDate={currentDate}
					currentViewName={currentViewName}
					onCurrentViewNameChange={setCurrentViewName}
					onCurrentDateChange={setCurrentDate}
				/>
				<EditingState onCommitChanges={commitChanges} />
				<IntegratedEditing />
				<WeekView startDayHour={9} endDayHour={19} />
				<DayView startDayHour={9} endDayHour={19} />
				<MonthView />
				<Toolbar />
				<DateNavigator />
				<ViewSwitcher />
				<TodayButton />
				<EditRecurrenceMenu />
				<ConfirmationDialog />
				<Appointments />
				<AppointmentTooltip showOpenButton showDeleteButton />
				<AppointmentForm />
			</Scheduler>
		</Paper>
	);
}
