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
import { useTranslation } from 'react-i18next';
import {
	collection,
	addDoc,
	getDocs,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { db } from './firebase';
import './i18n';

export default function App() {
	const { t } = useTranslation(); // Hook do tłumaczenia
	const [data, setData] = useState([]);
	const [currentDate, setCurrentDate] = useState(
		new Date().toISOString().slice(0, 10)
	);
	const [currentViewName, setCurrentViewName] = useState('Month');

	const saveEventToFirestore = async (event) => {
		try {
			const docRef = await addDoc(collection(db, 'events'), event);
			return { id: docRef.id, ...event };
		} catch (error) {
			console.error(t('errorSavingEvent'), error);
		}
	};

	const fetchEventsFromFirestore = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, 'events'));
			const events = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				const startDate = data.startDate.toDate();
				const endDate = data.endDate.toDate();
				events.push({ id: doc.id, ...data, startDate, endDate });
			});
			return events;
		} catch (error) {
			console.error(t('errorFetchingEvents'), error);
		}
	};

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
				console.error(t('errorDeletingEvent'), error);
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
				<WeekView
					startDayHour={9}
					endDayHour={19}
					displayName={t('weekView')}
				/>
				<DayView startDayHour={9} endDayHour={19} displayName={t('dayView')} />
				<MonthView displayName={t('monthView')} />
				<Toolbar />
				<DateNavigator />
				<ViewSwitcher />
				<TodayButton messages={{ today: t('todayButton') }} />
				<EditRecurrenceMenu />
				<ConfirmationDialog />
				<Appointments />
				<AppointmentTooltip
					showOpenButton
					showDeleteButton
					messages={{
						editLabel: t('editLabel'),
						deleteLabel: t('deleteLabel'),
						closeLabel: t('closeLabel'),
					}}
				/>
				<AppointmentForm
					messages={{
						detailsLabel: t('detailsLabel'),
						titleLabel: t('titleLabel'),
						allDayLabel: t('allDayLabel'),
						repeatLabel: t('repeatLabel'),
						notesLabel: t('notesLabel'),
						fromLabel: t('fromLabel'),
						toLabel: t('toLabel'),
						locationLabel: t('locationLabel'),
						saveButton: t('saveButton'),
						deleteButton: t('deleteButton'),
						cancelButton: t('cancelButton'),
					}}
				/>
			</Scheduler>
		</Paper>
	);
}
