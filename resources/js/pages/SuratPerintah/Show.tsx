import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app/app-header-layout';
import { Heading } from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import type { SuratPerintah as SuratPerintahType } from '@/pages/types/surat-perintah';

interface ShowProps {
    suratPerintah: SuratPerintahType & {
        pejabat_penandatangan: { nama: string; nip: string; jabatan: string };
        peserta_perjalanan: Array<{
            id: number;
            pegawai: { nama: string; nip: string; jabatan: string };
            peran: string;
        }>;
    };
}

export default function Show({ suratPerintah }: ShowProps) {
    return (
        <AppLayout>
            <Head title={`Surat Perintah - ${suratPerintah.nomor_surat}`} />

            <div className="space-y-6 px-6 py-6">
                <Heading title="Detail Surat Perintah" subtitle={suratPerintah.nomor_surat} />

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informasi Surat</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nomor Surat:</span>
                                <span className="font-medium">{suratPerintah.nomor_surat}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={`font-medium ${suratPerintah.status === 'draft' ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {suratPerintah.status === 'draft' ? 'Draft' : 'Final'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Maksud:</span>
                                <span className="font-medium">{suratPerintah.maksud}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Dasar:</span>
                                <span className="font-medium">{suratPerintah.dasar}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Perjalanan</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tempat Berangkat:</span>
                                <span className="font-medium">{suratPerintah.tempat_berangkat}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tempat Tujuan:</span>
                                <span className="font-medium">{suratPerintah.tempat_tujuan}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tanggal Berangkat:</span>
                                <span className="font-medium">{suratPerintah.tanggal_berangkat}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tanggal Kembali:</span>
                                <span className="font-medium">{suratPerintah.tanggal_kembali}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Lama Perjalanan:</span>
                                <span className="font-medium">{suratPerintah.lama_perjalanan} hari</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Jenis Angkutan:</span>
                                <span className="font-medium">{suratPerintah.jenis_angkutan}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pejabat Penandatangan</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Nama:</span>
                            <span className="font-medium">{suratPerintah.pejabat_penandatangan.nama}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">NIP:</span>
                            <span className="font-medium">{suratPerintah.pejabat_penandatangan.nip}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Jabatan:</span>
                            <span className="font-medium">{suratPerintah.pejabat_penandatangan.jabatan}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Peserta Perjalanan</h3>

                    {suratPerintah.peserta_perjalanan.length > 0 ? (
                        <div className="grid gap-4">
                            {suratPerintah.peserta_perjalanan.map((peserta) => (
                                <div key={peserta.id} className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium">{peserta.pegawai.nama}</p>
                                            <p className="text-sm text-muted-foreground">{peserta.pegawai.nip}</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Peran</p>
                                            <p className="font-medium">{peserta.peran}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Tidak ada peserta perjalanan.</p>
                    )}
                </div>

                <Separator />

                <div className="flex gap-4">
                    <a
                        href={route('surat-perintah.edit', suratPerintah.id)}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Edit Surat Perintah
                    </a>

                    <a
                        href={route('surat-perintah.print-surat-tugas', suratPerintah.id)}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                        Cetak Surat Tugas
                    </a>

                    <a
                        href={route('surat-perintah.print-sppd-lembar-1', suratPerintah.id)}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                        Cetak SPPD Lembar 1
                    </a>

                    <a
                        href={route('surat-perintah.index')}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                        Kembali
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
