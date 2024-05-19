import {Season} from './../domain/season';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, from} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {Club} from '../domain/club/club';
import {MatchFixture} from '../domain/club/matchFixture';

const TEAMS = [
    {
        name: 'Real Madrid FC',
        shortName: 'Real Madrid',
        abbr: 'RMA',
        attackRating: 80,
        defenseRating: 80,
        midfieldRating: 90,
        overallRating: 86,
    },
    {
        name: 'Barcelona FC',
        shortName: 'Barcelona',
        abbr: 'FCB',
        attackRating: 80,
        defenseRating: 83,
        midfieldRating: 85,
        overallRating: 83,
    },
    {
        name: 'Paris Saint Germain',
        shortName: 'PSG',
        abbr: 'PSG',
        attackRating: 83,
        defenseRating: 77,
        midfieldRating: 80,
        overallRating: 80,
    },
    {
        name: 'BVB Dortmund',
        shortName: 'Dortmund',
        abbr: 'DOR',
        attackRating: 80,
        defenseRating: 78,
        midfieldRating: 78,
        overallRating: 79,
    },
    {
        name: 'Manchester City',
        shortName: 'Manchester City',
        abbr: 'MCY',
        attackRating: 87,
        defenseRating: 84,
        midfieldRating: 89,
        overallRating: 87,
    },
    {
        name: 'Liverpool FC',
        shortName: 'Liverpool',
        abbr: 'LFC',
        attackRating: 82,
        defenseRating: 84,
        midfieldRating: 82,
        overallRating: 83,
    },

];

@Injectable({
    providedIn: 'root',
})
export class LeagueService {
    private seasonSubject = new BehaviorSubject<Season>({
        id: 0,
        seasonName: '',
        startDate: '',
        endDate: '',
        leagueName: '',
        matchFixtures: [],
        clubs: [],
    });
    season$ = this.seasonSubject.asObservable();

    private matchFixturesSubject = new BehaviorSubject<MatchFixture[]>([]);
    matchFixtures$ = this.matchFixturesSubject.asObservable();

    private matchWeekSubject = new BehaviorSubject<number>(1);
    matchWeek$ = this.matchWeekSubject.asObservable();

    setSeason(season: Season): void {
        this.seasonSubject.next(season);
    }

    setMatchFixtures(matchFixtures: MatchFixture[]): void {
        this.matchFixturesSubject.next(matchFixtures);
    }

    setMatchWeek(week: number): void {
        this.matchWeekSubject.next(week);
    }

    setClubs(clubs: Club[]): void {
        const season = this.seasonSubject.value;
        if (season) {
            season.clubs = clubs;
            this.seasonSubject.next(season);
        }
    }

    getSeason(): Observable<Season | null> {
        return this.season$;
    }

    getMatchWeek(): Observable<number> {
        return this.matchWeek$;
    }

    getClubs(): Observable<Club[]> {
        return new Observable((observer) => {
            const season = this.seasonSubject.value;
            if (season) {
                observer.next(season.clubs);
                observer.complete();
            }
        });
    }

    getClubByName(clubName: string): Club | undefined {
        return this.seasonSubject.value?.clubs.find((c) => c.clubName === clubName);
    }

    updateClubStats(club: Club): void {
        const clubs = this.seasonSubject.value?.clubs;
        if (clubs) {
            const index = clubs.findIndex((c) => c.id === club.id);
            clubs[index] = club;
            this.setClubs(clubs);
        }
    }

    createClubs(leagueName: string): void {
        const teams = TEAMS.sort(() => Math.random() - 0.5);

        const clubs: Club[] = teams.map((team, index) => {
            return {
                id: index + 1,
                clubName: team.name,
                clubShortName: team.shortName,
                leagueName,
                abbr: team.abbr,
                clubStats: {
                    leaguePosition: index + 1,
                    championshipOdds: 0,
                    totalPoint: 0,
                    performance: {
                        attackRating: team.attackRating,
                        defenseRating: team.defenseRating,
                        midfieldRating: team.midfieldRating,
                        overallRating: team.overallRating,
                    },
                    goals: {
                        goalsScored: 0,
                        goalsConceded: 0,
                        goalDifference: 0,
                    },
                    totalMatchesPlayed: 0,
                    matchOutcome: {
                        winCount: 0,
                        drawCount: 0,
                        lossCount: 0,
                    },
                },
                matchRecords: {
                    homeRecord: {
                        winCount: 0,
                        drawCount: 0,
                        lossCount: 0,
                    },
                    awayRecord: {
                        winCount: 0,
                        drawCount: 0,
                        lossCount: 0,
                    },
                },
            };
        });

        this.setClubs(clubs);
    }

    createSeason(
        leagueName: string,
        seasonName: string,
        startDate: string,
        endDate: string
    ): void {
        this.createClubs(leagueName);
        const clubs = this.seasonSubject.value?.clubs;

        const matchFixtures = this.generateSeasonFixtures(clubs);
        const season: Season = {
            id: 1,
            seasonName,
            startDate,
            endDate,
            leagueName,
            matchFixtures,
            clubs,
        };
        this.setSeason(season);
        this.setMatchFixtures(matchFixtures);
    }

    generateSeasonFixtures(clubs: Club[]): MatchFixture[] {
        let seasonMatchFixtures: MatchFixture[] = [];

        let matchweeks: any[][] = [];
        let teams = clubs.map((club) => club.clubName);

        if (teams.length % 2) {
            teams.push('None');
        }

        const rounds = teams.length;

        for (let j = 0; j < (rounds - 1) * 2; j++) {
            matchweeks[j] = [];

            for (let i = 0; i < rounds / 2; i++) {
                if (teams[i] !== 'None' && teams[rounds - 1 - i] !== 'None') {
                    let homeTeam, awayTeam;

                    if (j % 2 == 1) {
                        homeTeam = teams[i];
                        awayTeam = teams[rounds - 1 - i];
                    } else {
                        homeTeam = teams[rounds - 1 - i];
                        awayTeam = teams[i];
                    }
                    matchweeks[j].push([homeTeam, awayTeam]);

                    const fixture: MatchFixture = {
                        homeTeam: homeTeam,
                        awayTeam: awayTeam,
                        matchweek: j + 1,
                    };
                    seasonMatchFixtures.push(fixture);
                }
            }
            const t = teams.pop();
            if (t) teams.splice(1, 0, t);
        }

        return seasonMatchFixtures;
    }

    generateGoals({
                      attackRating: att,
                      defenseRating: def,
                      midfieldRating: mdi,
                      overallRating: ovr,
                  }: {
        defenseRating: number;
        midfieldRating: number;
        attackRating: number;
        overallRating: number;
    }): number {
        const formule = def * 0.2 + mdi * 0.3 + att * 0.3 + ovr * 0.2;
        let goals = Math.floor(Math.random() * formule);
        const modValue = Math.floor(Math.random() * att);
        goals = modValue === 0 ? goals % 8 : goals % modValue;

        if (goals < 0) {
            goals = 0;
        } else if (goals > 6) {
            goals = Math.floor(Math.random() * 6);
        }

        return goals;
    }

    updatePostions(): void {
        const clubs = this.seasonSubject.value?.clubs;
        if (clubs) {
            clubs.sort((a, b) => {
                if (a.clubStats.totalPoint < b.clubStats.totalPoint) {
                    return 1;
                } else if (a.clubStats.totalPoint > b.clubStats.totalPoint) {
                    return -1;
                } else {
                    return a.clubStats.goals.goalDifference <
                    b.clubStats.goals.goalDifference
                        ? 1
                        : -1;
                }
            });

            clubs.forEach((club, index) => {
                club.clubStats.leaguePosition = index + 1;
            });

            this.setClubs(clubs);
        }
    }

    updateMatchFixture(fixture: MatchFixture): void {
        this.seasonSubject
            .pipe(
                map((season) => season?.matchFixtures),
                tap((matchFixtures) => {
                    if (!matchFixtures) return;
                    const index = matchFixtures.findIndex(
                        (f) =>
                            f.homeTeam === fixture.homeTeam &&
                            f.awayTeam === fixture.awayTeam &&
                            f.matchweek === fixture.matchweek
                    );
                    matchFixtures[index] = fixture;
                    this.matchFixturesSubject.next(matchFixtures);
                })
            )
            .subscribe();
    }

    updateStatsForMatch(
        club: Club,
        goalsFor: number,
        goalsAgainst: number
    ): void {
        this.updateMatchStats(club, goalsFor, goalsAgainst);
        this.updateMatchOutcome(club, goalsFor, goalsAgainst);
        this.updateClubStats(club);
        this.updatePostions();
    }

    updateClubStat(
        homeClub: Club,
        awayClub: Club,
        homeGoals: number,
        awayGoals: number
    ): void {
        const week = this.matchWeekSubject.value;

        this.updateStatsForMatch(homeClub, homeGoals, awayGoals);
        this.updateStatsForMatch(awayClub, awayGoals, homeGoals);

        this.updateMatchFixture({
            homeTeam: homeClub.clubName,
            awayTeam: awayClub.clubName,
            matchweek: week,
            homeTeamScore: homeGoals,
            awayTeamScore: awayGoals,
        });
    }

    updateMatchStats(
        club: Club,
        goalsScored: number,
        goalsConceded: number
    ): void {
        club.clubStats.totalMatchesPlayed++;
        club.clubStats.goals.goalsScored += goalsScored;
        club.clubStats.goals.goalsConceded += goalsConceded;
        club.clubStats.goals.goalDifference =
            club.clubStats.goals.goalsScored - club.clubStats.goals.goalsConceded;
    }

    updateWin(club: Club): void {
        club.clubStats.totalPoint += 3;
        club.clubStats.matchOutcome.winCount++;
    }

    updateLoss(club: Club): void {
        club.clubStats.matchOutcome.lossCount++;
    }

    updateDraw(club: Club): void {
        club.clubStats.totalPoint += 1;
        club.clubStats.matchOutcome.drawCount++;
    }

    updateMatchOutcome(
        club: Club,
        goalsScored: number,
        goalsConceded: number
    ): void {
        if (goalsScored > goalsConceded) {
            this.updateWin(club);
        } else if (goalsScored < goalsConceded) {
            this.updateLoss(club);
        } else {
            this.updateDraw(club);
        }
    }

    calculateChampionshipOdds(): void {
        const clubs = this.seasonSubject.value?.clubs;
        const leaderPoint = clubs[0].clubStats.totalPoint;
        const week = this.matchWeekSubject.value;
        let totalPoint = 0;

        if (!clubs) return;

        if (week > 10) {
            clubs.forEach((club, index) => {
                if (index === 0) club.clubStats.championshipOdds = 100;
                else club.clubStats.championshipOdds = 0;
            });
            return;
        }

        totalPoint = clubs.reduce(
            (acc, club) => acc + club.clubStats.totalPoint,
            0
        );

        clubs.forEach((club) => {
            const pointDifference = leaderPoint - club.clubStats.totalPoint;
            if (pointDifference > (10 - week) * 3) {
                club.clubStats.championshipOdds = 0;
                totalPoint -= club.clubStats.totalPoint;
            } else {
                club.clubStats.championshipOdds = 1;
            }
        });

        clubs.forEach((club) => {
            if (club.clubStats.championshipOdds !== 0) {
                let championshipOdd = Math.round(
                    (100 / totalPoint) * club.clubStats.totalPoint
                );
                club.clubStats.championshipOdds = championshipOdd;
            }
        });

        this.setClubs(clubs);
    }

    simulateMatch(fixture: MatchFixture): void {
        const homeClub = this.getClubByName(fixture.homeTeam);
        const awayClub = this.getClubByName(fixture.awayTeam);

        if (homeClub && awayClub) {
            const homeGoals = this.generateGoals(homeClub.clubStats.performance);
            const awayGoals = this.generateGoals(awayClub.clubStats.performance);

            this.updateClubStat(homeClub, awayClub, homeGoals, awayGoals);
        }
    }

    simulateWeek(): void {
        const week = this.matchWeekSubject.value;
        const matchFixtures = this.seasonSubject.value?.matchFixtures;
        const totalWeeks = matchFixtures.length / 3;

        if (week > totalWeeks) return;

        from(matchFixtures)
            .pipe(
                filter((fixture) => fixture.matchweek === week),
                tap((fixture) => this.simulateMatch(fixture))
            )
            .subscribe();

        if (week <= totalWeeks) this.setMatchWeek(week + 1);

        this.calculateChampionshipOdds();
    }

    simulateSeason(): void {
        const week = this.matchWeekSubject.value;
        const matchFixtures = this.seasonSubject.value?.matchFixtures;
        const totalWeeks = matchFixtures.length / 3;

        if (week > totalWeeks) return;

        for (let i = week; i <= totalWeeks; i++) {
            this.simulateWeek();
        }
    }

    createNewSeason(): void {
        this.setSeason({
            id: 0,
            seasonName: '',
            startDate: '',
            endDate: '',
            leagueName: '',
            matchFixtures: [],
            clubs: [],
        });
        this.setMatchFixtures([]);
        this.setMatchWeek(1);
        this.createSeason('SuperLiga', '2024-2025', 'Szeptember 2023', 'May 2024');
    }
}
